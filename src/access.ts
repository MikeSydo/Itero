/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: any) {
  return {
    // Базові права доступу - поки що всі мають доступ
    canAccessWelcome: true,
    canAccessBoard: true,
  };
}
