import React from 'react'
import Swal from 'sweetalert2';

export default function useSweetAlert() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          title: 'text-sm',
          popup: 'rounded-full',
        },
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
  return Toast;
}
