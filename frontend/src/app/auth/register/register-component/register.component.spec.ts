import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register-component';
import { AuthType } from '../../model/auth-user-type';
import template from './register-component.html?raw';
import { AuthService } from '../../service/auth.service';

type AuthServiceMock = {
  registerUser: ReturnType<typeof vi.fn>;
  errorMessage: ReturnType<typeof signal<string>>;
  successMessage: ReturnType<typeof signal<string>>;
  isRegistrationSuccessful: ReturnType<typeof signal<boolean>>;
  authService: ReturnType<typeof signal<AuthType | undefined>>;
};

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;

  let authService: AuthServiceMock;

  const createAuthServiceMock = (): AuthServiceMock => ({
    registerUser: vi.fn(),
    errorMessage: signal('error'),
    successMessage: signal('success'),
    isRegistrationSuccessful: signal(false),
    authService: signal<AuthType | undefined>(undefined),
  });

  const createComponent = async () => {
    await resolveComponentResources((url) => {
      if (url.endsWith('register-component.html')) {
        return Promise.resolve(template);
      }

      if (url.endsWith('register-component.css')) {
        return Promise.resolve('');
      }

      return Promise.reject(new Error(`Unexpected component resource: ${url}`));
    });

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    // This creates the real component instance plus its rendered template.
    fixture = TestBed.createComponent(RegisterComponent);
    // `fixture.componentInstance` gives direct access to the class instance.
    component = fixture.componentInstance;
    // `fixture.detectChanges()` tells Angular to update the template.
    // On the first run, Angular also calls lifecycle hooks like `ngOnInit()`.
    fixture.detectChanges();
  };

  // `beforeEach(...)` runs before every single test.
  beforeEach(() => {
    // Reset Angular's testing state so every test starts clean.
    TestBed.resetTestingModule();
    // Create fresh mocks for each test.
    authService = createAuthServiceMock();
  });

  it('does not submit when the registration form is invalid', async () => {
    await createComponent();

    expect(component.registerForm.invalid).toBe(true);

    component.onSubmit('', '');

    expect(authService.registerUser).not.toHaveBeenCalled();
  });

  it('submits registration form successfully and resets it', async () => {
    authService.registerUser.mockReturnValue(of('ok'));
    await createComponent();

    component.registerForm.setValue({
      email: 'admin@gmx.at',
      password: 'easy123',
    });

    expect(component.registerForm.valid).toBe(true);

    component.onSubmit('admin@gmx.at', 'easy123');

    expect(authService.registerUser).toHaveBeenCalledWith('admin@gmx.at', 'easy123');
    expect(authService.successMessage()).toBe('Successful registration.');
    expect(authService.errorMessage()).toBe('');

    // Resets the form.
    expect(component.registerForm.getRawValue()).toEqual({ email: null, password: null });
  });

  it('does not successfully register with backend error', async () => {
    authService.registerUser.mockReturnValue(
      throwError(() => ({
        error: JSON.stringify({ code: 'error' }),
      })),
    );

    await createComponent();

    component.registerForm.setValue({
      email: 'admin@gmx.at',
      password: 'easy123',
    });

    expect(component.registerForm.valid).toBe(true);
    component.onSubmit('admin@gmx.at', 'easy123');

    expect(authService.registerUser).toHaveBeenCalledWith('admin@gmx.at', 'easy123');
    expect(authService.errorMessage()).toBe('error');
  });
});
