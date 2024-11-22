import { reducer, initialState } from '../components/registration/SignUpForm'; // Import the reducer and initialState

describe('SignUpForm reducer', () => {
  const initialState = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    focusOnPassword: -1,
    confirmPassword: '',
    focusOnConfirmPassword: -1,
    errorPasswordMatch: '',
    loading: false,
    error: '',
    captchaVerified: false,
    captchaToken: null,
  };

  test('should toggle showPassword', () => {
    const action = { type: 'togglePass' };
    const expectedState = { ...initialState, showPassword: true };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should toggle showConfirmPassword', () => {
    const action = { type: 'toggleConfirmPass' };
    const expectedState = { ...initialState, showConfirmPassword: true };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update userName', () => {
    const action = { type: 'userName', payload: 'testuser' };
    const expectedState = { ...initialState, userName: 'testuser' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update email', () => {
    const action = { type: 'email', payload: 'test@example.com' };
    const expectedState = { ...initialState, email: 'test@example.com' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update phoneNumber', () => {
    const action = { type: 'phoneNumber', payload: '1234567890' };
    const expectedState = { ...initialState, phoneNumber: '1234567890' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update password', () => {
    const action = { type: 'password', payload: 'password123' };
    const expectedState = { ...initialState, password: 'password123' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update confirmPassword', () => {
    const action = { type: 'confirmPassword', payload: 'password123' };
    const expectedState = { ...initialState, confirmPassword: 'password123' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update loading', () => {
    const action = { type: 'loading', payload: true };
    const expectedState = { ...initialState, loading: true };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update error', () => {
    const action = { type: 'error', payload: 'An error occurred' };
    const expectedState = { ...initialState, error: 'An error occurred' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update captchaVerified', () => {
    const action = { type: 'captchaVerified', payload: true };
    const expectedState = { ...initialState, captchaVerified: true };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });

  test('should update captchaToken', () => {
    const action = { type: 'captchaToken', payload: 'token123' };
    const expectedState = { ...initialState, captchaToken: 'token123' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(expectedState);
  });
});
