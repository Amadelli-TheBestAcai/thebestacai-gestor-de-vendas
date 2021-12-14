import React from "react";

export function useAsyncHook<T>(func: Function): [T, boolean] {
  const [result, setResult] = React.useState<T>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchAsyncFunc() {
      setLoading(true);
      const response = await func();
      console.log({ response });
      setResult(response);
      setLoading(false);
    }

    fetchAsyncFunc();
  }, [func]);

  return [result, loading];
}
