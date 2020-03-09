import { SweetAlertOptions, SweetAlertIcon } from 'sweetalert2';

export default (): SweetAlertOptions => {
  return {
    title: '',
    icon: 'success',
    text: '',
    position: 'top',
    toast: true,
    timer: 800,
    animation: false,
    showConfirmButton: false,
  }
}
