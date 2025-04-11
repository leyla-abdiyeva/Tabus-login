// import {CanActivateFn, Router} from '@angular/router';
// import {AuthService} from '../auth/auth.service';
// import {inject} from "@angular/core";
// import {map, tap} from "rxjs";
//
// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//
//   const isUserSignedIn = authService.isUserSignedIn();
//
//   return isUserSignedIn.pipe(
//     tap((isSignedIn) => {
//       if (!isSignedIn) {
//         // If the user is not signed in, navigate to the dashboard
//         alert('auth problems');
//         router.navigate(['/login']);
//       }
//     }),
//     map((isSignedIn) => isSignedIn) // Return the boolean value directly
//   );
//
//
// };
