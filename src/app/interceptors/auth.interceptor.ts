import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const branchId = localStorage.getItem('currentBranchId'); // Kuhaon ang pinili nga branch sa user

  // Kon naay token, i-clone ang request ug i-add ang Headers
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        // Gidugang nato ang x-branch-id sa header
        // Kon null ang branchId, i-pass lang ang empty string o i-handle sa backend
        'x-branch-id': branchId ? branchId : ''
      }
    });
    return next(cloned);
  }

  return next(req);
};