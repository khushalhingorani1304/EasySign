import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFPreview = ({ url, onClick }) => {
  const canvasRef = useRef();
  const renderTaskRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel any previous render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        // Save reference so we can cancel if needed
        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (error) {
        if (error?.name !== 'RenderingCancelledException') {
          console.error('PDF render error:', error);
        }
      }
    };

    if (url) renderPDF();

    // Cancel render if component unmounts or updates
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [url, pageNumber]);

  const scaleX = 1.65;
  const scaleY = 4;

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX - rect.left)/scaleX;
    const y = (canvas.height - (e.clientY - rect.top))/scaleY;

    if (onClick) {
      onClick({ x, y, page: pageNumber });
    }
  };

  return (
    <div className="space-y-4 text-center">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="mx-auto border rounded shadow-md cursor-crosshair max-w-full h-auto"
      />
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span>
          Page {pageNumber} of {totalPages}
        </span>
        <button
          onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
          disabled={pageNumber === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFPreview;
