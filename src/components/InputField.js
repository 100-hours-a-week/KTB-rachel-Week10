import React from 'react';

export default function InputField({ 
  label, 
  type, 
  id, 
  placeholder, 
  autoComplete, 
  value, 
  onChange, 
  errorMessage, 
  helperText
}) {
  return (
    <div className="field">
      {/* 1. 라벨 영역 */}
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      {/* 2. 입력창 영역 (autoComplete로 리액트 표준 변경) */}
      <input
        type={type}
        id={id}
        className="field__input"
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required
      />

      {/* 3. 메시지 영역 */}
      {errorMessage ? (
        <p className="field__helper field__helper--error" id={`${id}Helper`}>
          {errorMessage}
        </p>
      ) : (
        helperText && (
          <p className="field__helper field__helper--hint" id={`${id}Helper`}>
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

