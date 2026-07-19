export const validateEmail = (email) => {
    // 1. 이메일 비었을 때
    if (!email || !email.trim()) {
        return '이메일을 입력해 주세요.';
    }
    // 2. 이메일 @ 형식 검사 (표준 이메일 정규식 사용)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return '올바른 이메일 형식이 아닙니다.';
    }
    
    // 3. 이메일 중복 검사

    return '';
};

export const validatePassword = (password) => {
    // 1. 비번 비었을 때
    if (!password) {
        return '비밀번호를 입력해 주세요.';
    }
    // 2. 비밀번호 길이 검사
    if (password.length < 8) {
        return '비밀번호는 8자리 이상이어야 합니다.';
    }
    // 3. 대소문자, 숫자, 특수문자 각각 최소 1개 이상 포함 검사
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return '비밀번호는 대소문자, 숫자, 특수문자를 각각 최소 1개 이상 포함해야 합니다.';
    }

    return '';
};

export const validatePasswordCheck = (password, passwordCheck) => {
    // 1. 비번확인 비었을 때
    if (!passwordCheck) {
        return '비밀번호 확인을 입력해 주세요.';
    }
    // 2. 비밀번호와 다를 때
    if (password !== passwordCheck) {
        return '비밀번호가 일치하지 않습니다.';
    }
    
    return '';
}

export const validateNickname = (nickname) => {
    // 1. 닉네임 비었을 때
    if (!nickname || !nickname.trim()) {
        return '닉네임을 입력해 주세요.';
    }
    // 2. 닉네임은 10자 이내여야 합니다.
    if (nickname.length > 10) {
        return '닉네임은 10자 이내여야 합니다.';
    }
    // 3. 닉네임 중복 확인

    return '';
}