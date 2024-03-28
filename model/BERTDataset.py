from torch.utils.data import Dataset
import gluonnlp as nlp
import numpy as np

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