import { useCallback, useState } from "react";

// 단일 검사 함수 하나만 받는다.
export function useInput(initialValue, validate) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const onChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue); 

    if (validate) {
      const errorMessage = validate(newValue); 
      setError(errorMessage); 
    }
    }, [validate]);

    const reset = useCallback(() => {
        setValue(initialValue);
        setError("");
    }, [initialValue]);

  return { value, error, onChange, reset };
}