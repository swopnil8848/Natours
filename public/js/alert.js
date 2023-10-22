// type is 'sucess' or 'error'

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

// export const hideAlert = () => {
//     const el = document.querySelector('.alert');
//     if (el) el.parentElement.removeChild(el);
// }

// export const showAlert = (type, msg) => {
//     hideAlert();
//     const markup = <div class="alert alert--${type}">${msg}</div>; // Added a closing backtick after ${type}
//     document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//     window.setTimeout(hideAlert, 5000);
// }