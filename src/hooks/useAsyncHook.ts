import React from "react";

export function useAsyncHook(func: Function) {
  const [result, setResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchAsyncFunc() {
      setLoading(true);
      const response = await func();
      setResult(response);
      setLoading(false);
    }

    fetchAsyncFunc();
  }, [func]);

  return [result, loading];
}
