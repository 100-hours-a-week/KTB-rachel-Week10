import React from 'react';

function InputField({ 
  label, // 이게뭐야
  type, // 이게뭐야
  id, 
  placeholder, // 이게뭐야
  autocomplete, // 이게 뭐야
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

      {/* 2. 입력창 영역 */}
      <input
        type={type}
        id={id}
        className="field__input"
        placeholder={placeholder}
        autoComplete={autocomplete}
        value={value}
        onChange={onChange}
        required
      />

      {/* 3. 메시지 영역 */}
      {/* 에러 메시지가 있다면 빨간색 에러 스타일로 보여주고, 없으면 기본 힌트 메시지를 보여줍니다. */}
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

export default InputField;