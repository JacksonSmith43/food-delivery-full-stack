import { ɵresolveComponentResources as resolveComponentResources, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import template from './login.component.html?raw';

import { LoginComponent } from './login.component';
import { AuthType } from '../../model/auth-user-type';
import { AuthService } from '../../service/auth.service';

// This file tests the real LoginComponent.
// We do NOT replace the component itself.
// We only replace its dependencies (AuthService, Router, ActivatedRoute) with mocks.

// `type AuthServiceMock = { ... }` defines the shape of our fake AuthService.
// This helps TypeScript understand which properties and methods exist on the mock.
type AuthServiceMock = {
  // `vi.fn()` creates a Vitest mock function.
  // `typeof vi.fn` means: take the type of the function `vi.fn`.
  // `ReturnType<...>` means: get the type that function returns.
  // So this line means: `loginUser` should have the same type as a function created by `vi.fn()`.
  // That gives us mock methods such as `.mockReturnValue(...)` and `.mockImplementation(...)`.
  loginUser: ReturnType<typeof vi.fn>;

  // `signal<string>` returns an Angular signal function that stores a string value.
  // `ReturnType<typeof signal<string>>` means: use the returned signal type here.
  errorMessage: ReturnType<typeof signal<string>>;
  successMessage: ReturnType<typeof signal<string>>;

  // `AuthType | undefined` means the value can either be an AuthType object or undefined.
  authUser: ReturnType<typeof signal<AuthType | undefined>>;
};

// `describe(...)` groups related tests together.
describe('LoginComponent', () => {
  // `fixture` is Angular's test wrapper around the created component.
  // It gives us access to:
  // - the component instance
  // - the rendered HTML
  // - Angular change detection
  let fixture: ComponentFixture<LoginComponent>;

  // `component` is the real instance of LoginComponent created by Angular.
  let component: LoginComponent;

  // These variables hold our mocked dependencies.
  let authService: AuthServiceMock;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let activatedRoute: { snapshot: { queryParams: Record<string, string> } };

  // This helper creates a fresh AuthService mock for every test.
  // Fresh mocks are important so tests do not leak state into each other.
  const createAuthServiceMock = (): AuthServiceMock => ({
    loginUser: vi.fn(),
    errorMessage: signal('stale error'),
    successMessage: signal('Welcome back'),
    authUser: signal<AuthType | undefined>(undefined),
  });

  // `async` means this function uses asynchronous work.
  // `await` pauses until the Promise is finished.
  const createComponent = async () => {
    // The component uses `templateUrl` and `styleUrl`.
    // In this Vitest setup, we manually tell Angular how to load those files.
    // `?raw` means Vite imports the HTML file as plain text instead of as a normal module.
    await resolveComponentResources((url) => {
      // If Angular asks for the HTML file, return the raw template string.
      if (url.endsWith('login.component.html')) {
        return Promise.resolve(template);
      }

      // If Angular asks for the CSS file, return an empty string.
      // The styles are not important for the behaviour tested here.
      if (url.endsWith('login.component.css')) {
        return Promise.resolve('');
      }

      // Fail fast if Angular asks for an unexpected file.
      return Promise.reject(new Error(`Unexpected component resource: ${url}`));
    });

    // TestBed creates a small Angular test module for this spec.
    // `imports: [LoginComponent]` works because LoginComponent is standalone.
    // `providers` replaces the real services with our fake ones.
    // If Angular tries to inject AuthService, Router, or ActivatedRoute in the component, they will get the mocks instead.
    // useValue is variable that holds the value we want to provide for that token. There are also other options like useClass and useFactory, but useValue is the simplest for our case. It just means: whenever someone asks for AuthService, give them this specific object (the mock) instead of the real AuthService class. This allows us to control the behaviour of those dependencies in our tests.
    // configureTestingModule builds a small Angular test world just for this test. So which components, services, and other dependencies are available in that world is determined by the configuration we pass to it. It tells it what is required and how the test environment is supposed to look like.
    // compileComponents prepares and compiles the component's template and styles so that it can be created.
    // All in all this means: we create a test world where LoginComponent is the real component, but its dependencies are replaced with our mocks. This allows us to test LoginComponent in isolation, without relying on the real implementations of AuthService, Router, or ActivatedRoute.
    // Process: This happens in src/app/auth/login/login.component/login.component.ts: authService = inject(AuthService); As soon as Angular creates the real LoginComponent in the testworld, Angular wonders: What should I inject for AuthService? The response comes from the providers part in the login spec file and the mock is injected instead.
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    // This creates the real component instance plus its rendered template.
    fixture = TestBed.createComponent(LoginComponent);

    // `fixture.componentInstance` gives direct access to the class instance.
    component = fixture.componentInstance;
    console.log('component: ', component);

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
    router = { navigateByUrl: vi.fn() };
    activatedRoute = { snapshot: { queryParams: {} } };
  });

  it('does not submit when the form is invalid', async () => {
    await createComponent();

    expect(component.loginForm.invalid).toBe(true);

    component.onSubmit('', '');

    expect(authService.loginUser).not.toHaveBeenCalled();
  });

  it('submits valid form and resets it afterwards', async () => {
    // This does not run the real AuthService.loginUser() method.
    // It only tells the mock what it should return when the component calls loginUser(...).
    // `of('ok')` creates a fake successful Observable, so the component enters the `next` path in `onLogin()`.
    authService.loginUser.mockReturnValue(of('ok'));

    await createComponent();

    component.loginForm.setValue({
      email: 'admin@gmx.at',
      password: 'easy123',
    });

    expect(component.loginForm.valid).toBe(true);

    // This runs the real component method.
    // Inside `onSubmit()`, the real component code still calls `this.onLogin(...)` and later resets the form.
    // The only fake part is the service response returned by the mocked authService.loginUser(...).
    component.onSubmit('admin@gmx.at', 'easy123');

    // This proves that the component tried to start the login process with the expected credentials.
    expect(authService.loginUser).toHaveBeenCalledWith('admin@gmx.at', 'easy123');

    // This proves that the real component code reached `this.loginForm.reset()` after the valid submit.
    expect(component.loginForm.getRawValue()).toEqual({ email: null, password: null });
  });
});
