import { useCallback, useState } from "react";

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

  return { value, error, onChange, reset, setValue, setError };
}