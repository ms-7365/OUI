import torch
from torch.utils.data import Dataset, DataLoader
import gluonnlp as nlp
import numpy as np
import onnxruntime
import re
import numpy as np

from openvino.runtime import Core
from .KoBERT.kobert import get_tokenizer
from .KoBERT.kobert import get_pytorch_kobert_model
from utils import singleton

@singleton
class OuiInference(object):
    def __init__(self, threshold=0.5, max_len=100, batch_size=128, device="cpu"):
        self.model_pytorch = torch.jit.load('./ai/pytorch/oui_240329_acc57_torchscript.pt')
        self.model_onnx = onnxruntime.InferenceSession("./ai/onnx/oui_acc57_240329.onnx")

        ie = Core()
        network = ie.read_model(model="./ai/openvino/oui_acc57_240329.xml", weights="./ai/openvino/oui_acc57_240329.bin")
        self.model_openvino = ie.compile_model(model=network, device_name="CPU")
        self.openvino_outputlayer = next(iter(self.model_openvino.outputs))
        
        _, vocab = get_pytorch_kobert_model(cachedir="./ai/KoBERT/.cache")
        tokenizer = get_tokenizer()
        self.tok = nlp.data.BERTSPTokenizer(tokenizer, vocab, lower=False)
        self.emotion_to_idx = {0:'angry', 1:'embarrassed', 2:'sad', 3:'happy', 4:'doubtful', 5:"comfortable", 6:"neutral"} 
        self.max_len = max_len
        self.batch_size=batch_size
        self.threshold=threshold
        self.device = device  
    
    def __transform__(self, X):
        X_split = [X]
        sentences = [[re.sub('[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]','',x).replace(" ", ""), 0]  for x in X_split]
        dataset = BERTDataset(sentences, 0, 1, self.tok, self.max_len, True, False)
        dataloader = DataLoader(dataset, batch_size=self.batch_size, num_workers=1)
        return dataloader
    
    def __to__json__(self, result):
        scores, emotions = result[0]

        result_dict = dict()
        for key in self.emotion_to_idx:
            idx = int(key)
            name = self.emotion_to_idx[key]

            if idx==6:
                continue

            result_dict[name] = float(scores[idx])
        result_dict["emotionList"] = emotions
        return result_dict

    def predict_onnx(self, X):
        dataloader = self.__transform__(X)
        test_eval = []
        for token_ids, valid_length, segment_ids, _ in dataloader:
            token_ids = token_ids.long().to(self.device)
            segment_ids = segment_ids.float().to(self.device)
            valid_length= valid_length.long()
            
            out = self.model_onnx.run(None, {
                "token_ids":np.array(token_ids),
                "valid_length": np.array(valid_length),
                "segment_ids": np.array(segment_ids)})

            for i in out:
                logits=i[0][:6]
                positive_indices = np.where(logits > self.threshold)[0]
                positive_values = logits[positive_indices]
                sorted_indices = positive_indices[np.argsort(positive_values)[::-1]]
                emotions = list(map(lambda x: self.emotion_to_idx[x], sorted_indices))
                test_eval.append((logits, emotions))
        return self.__to__json__(test_eval)

    def predict_pytorch(self, X):
        dataloader = self.__transform__(X)
        test_eval = []
        for token_ids, valid_length, segment_ids, _ in dataloader:
            token_ids = token_ids.long().to(self.device)
            segment_ids = segment_ids.long().to(self.device)
            valid_length= valid_length
             
            out = self.model_pytorch(token_ids, valid_length, segment_ids)

            for i in out:
                logits=i[:6]
                logits = logits.detach().cpu().numpy()
                positive_indices = np.where(logits > self.threshold)[0]
                positive_values = logits[positive_indices]
                sorted_indices = positive_indices[np.argsort(positive_values)[::-1]]
                emotions = list(map(lambda x: self.emotion_to_idx[x], sorted_indices))
                test_eval.append((logits, emotions))
    
        return self.__to__json__(test_eval)

    def predict_openvino(self, X):
        dataloader = self.__transform__(X)
        
        test_eval=[]
        for token_ids, valid_length, segment_ids, _ in dataloader:
            token_ids = token_ids.long().to(self.device)
            segment_ids = segment_ids.float().to(self.device)
            valid_length= valid_length.long()
            out = self.model_openvino([token_ids, valid_length, segment_ids])[self.openvino_outputlayer]
            
            for i in out:
                logits=i[:6]
                positive_indices = np.where(logits > self.threshold)[0]
                positive_values = logits[positive_indices]
                sorted_indices = positive_indices[np.argsort(positive_values)[::-1]]
                emotions = list(map(lambda x: self.emotion_to_idx[x], sorted_indices))
                test_eval.append((logits, emotions))
    
        return self.__to__json__(test_eval)
    
class BERTDataset(Dataset):
    def __init__(self, dataset, sent_idx, label_idx, bert_tokenizer, max_len,
                 pad, pair):
        transform = nlp.data.BERTSentenceTransform(
            bert_tokenizer, max_seq_length=max_len, pad=pad, pair=pair)

        self.sentences = []
        self.labels = []
        for i in dataset:
            if len(i)!=2:
                continue

            self.sentences.append(transform([i[sent_idx]]))
            self.labels.append(np.int32(i[label_idx]))
        

    def __getitem__(self, i):
        return (self.sentences[i] + (self.labels[i], ))

    def __len__(self):
        return (len(self.labels))
