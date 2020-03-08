import { SweetAlertOptions, SweetAlertIcon } from 'sweetalert2';

export default (): SweetAlertOptions => {
  return {
    title: '',
    icon: 'success',
    text: '',
    position: 'top-end',
    toast: true,
  }
}
