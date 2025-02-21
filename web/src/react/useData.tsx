import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";

type State<T> =
  | {
      loading: true;
      data: undefined;
      error: null;
    }
  | {
      loading: false;
      data: T;
      error: null;
    }
  | {
      loading: false;
      data: undefined;
      error: Error;
    };
export function use<T>(fetcher: () => Promise<T>): State<T> & {
  reload: () => void;
} {
  const [state, setState] = useState<State<T>>({
    loading: true,
    data: undefined,
    error: null,
  });
  // biome-ignore lint:
  const reload = useCallback(async () => {
    try {
      setState({
        loading: true,
        data: undefined,
        error: null,
      });
      const data = await fetcher();
      setState({
        loading: false,
        data: data,
        error: null,
      });
    } catch (err) {
      setState({
        loading: false,
        data: undefined,
        error: new Error("Failed to fetch resource", {
          cause: err,
        }),
      });
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    ...state,
    reload,
  };
}
