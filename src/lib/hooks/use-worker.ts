"use client";

import { useCallback, useEffect, useRef } from "react";

type MessageHandler<T> = (data: T) => void;

interface UseWorkerResult<TIn, TOut> {
  postMessage: (data: TIn) => void;
  terminate: () => void;
  isReady: boolean;
}

export function useWorker<TIn, TOut>(
  workerFactory: () => Worker,
  onMessage: MessageHandler<TOut>,
  onError?: (error: ErrorEvent) => void,
): UseWorkerResult<TIn, TOut> {
  const workerRef = useRef<Worker | null>(null);
  const isReadyRef = useRef(false);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  onMessageRef.current = onMessage;
  onErrorRef.current = onError;

  useEffect(() => {
    const worker = workerFactory();
    workerRef.current = worker;
    isReadyRef.current = true;

    worker.onmessage = (e: MessageEvent<TOut>) => {
      onMessageRef.current(e.data);
    };

    worker.onerror = (e: ErrorEvent) => {
      if (onErrorRef.current) {
        onErrorRef.current(e);
      } else {
        console.error("[useWorker] Worker error:", e.message);
      }
    };

    return () => {
      isReadyRef.current = false;
      worker.terminate();
      workerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerFactory]);

  const postMessage = useCallback((data: TIn) => {
    if (workerRef.current && isReadyRef.current) {
      workerRef.current.postMessage(data);
    }
  }, []);

  const terminate = useCallback(() => {
    if (workerRef.current) {
      isReadyRef.current = false;
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    postMessage,
    terminate,
    isReady: isReadyRef.current,
  };
}
