import { fabric } from 'fabric';
import { useEffect } from 'react';
import WebFont from 'webfontloader';

const Canvas = ( props: CanvasProps ) => {
  const { canvasRef, setCanvas, canvas, activeTool, textboxRef, setIsFontLoaded } = props;

  useEffect(() => {
    WebFont.load({
        custom: {
          families: ['DoveMayo', 'DoveMayoBold', 'IMHyeMin', 'IMHyeMinBold', 'Cafe24Supermagic', 'Cafe24SupermagicBold', 'HakgyoansimGaeulsopung', 'HakgyoansimGaeulsopungBold'],
          urls: ['src/asset/fonts']
        },
        active: () => {
          if(setIsFontLoaded) {
            setIsFontLoaded(true);
          }
        }
    });

    // 캔버스 생성
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 950,
      height: 1000,
      backgroundColor: '#FFFEFC'
    });

    fabric.Object.prototype.set({
      cornerSize: 10,
      cornerStyle: 'rect',
      transparentCorners: false,
      cornerColor: '#CDCDCD',
      borderColor: '#CDCDCD',
    });

    newCanvas.freeDrawingBrush.width = 10;

    setCanvas(newCanvas);
  }, []);

  // 객체 선택 시 삭제 버튼 추가
  useEffect(() => {
    if (!canvas) return;

    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 16,
      offsetY: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: deleteObject,
      render: renderIcon,
    });

    function renderIcon(ctx: CanvasRenderingContext2D, left: number, top: number, fabricObject: fabric.Object): void {
      const size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    const img = new Image();
    img.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
    img.onload = () => {
      canvas.renderAll();
    };
  }, [ canvas ]);   

  // 객체 삭제
  function deleteObject(eventData: MouseEvent, transformData: fabric.Transform, x: number, y: number): boolean {
    const canvas = transformData.target.canvas;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach(object => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      return true;
    }
    return false;
  }

  useEffect(() => {
    if(!canvasRef.current && !canvas) return;
    
    switch(activeTool) {
      case "drawing":
        handlePenTool();
        disableTextbox();
        break;
      case "textbox":
        disablePenTool();
        handleTextboxTool();
        break;
      default:
        disablePenTool();
        disableTextbox();
    }
  }, [ activeTool ]);

  // 텍스트박스 선택 활성화
  const handleTextboxTool = () => {
    if(!canvas) return;

    canvas.isDrawingMode = false;
    canvas.setActiveObject(textboxRef.current);
    canvas.renderAll();
  }

  // 텍스트박스 선택 비활성화
  const disableTextbox = () => {
    if(!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();
  } 

  // 펜 활성화
  const handlePenTool = () => {
    if(!canvas) return;

    canvas.isDrawingMode = true;
  };

  // 펜 비활성화
  const disablePenTool = () => {
    if(!canvas) return;

    canvas.isDrawingMode = false;
  }

  // Canvas에서 마우스 이벤트 핸들링
  useEffect(() => {
    if (!canvas) return;

    canvas.selectionColor = 'rgba(0, 0, 0, 0)';
    canvas.on('mouse:move', handleMouseOver);
    canvas.on('mouse:on', handleMouseOver);

    return () => {
      canvas.off('mouse:move', handleMouseOver);
    };
  }, [ canvas, activeTool ]);

  // 마우스가 지나가는 객체를 확인하여 삭제(selectable 객체만 삭제)
  const handleMouseOver = (event: any) => {
    if (activeTool === 'eraser' && event.target && event.target.selectable && event.target.type === 'path') {
      canvas.remove(event.target);
      canvas.renderAll();
    }
  };

  return (
    <canvas ref={ canvasRef }/>
  )
};

export default Canvas;

type CanvasProps = {
  canvasRef?: React.MutableRefObject<any>,
  textboxRef?: React.MutableRefObject<fabric.Textbox>,
  canvas?: fabric.Canvas, 
  setCanvas?: React.Dispatch<React.SetStateAction<fabric.Canvas>>, 
  activeTool?: string, 
  setIsFontLoaded?: React.Dispatch<React.SetStateAction<boolean>>,
}