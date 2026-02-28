import { Logo } from '@/shared/components/ui/custom-icon';
import { LoginForm } from '../components/LoginForm';

/**
 * LoginPage
 * Handles page layout and composition
 * Logo, header, form placement, and image
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 bg-white">
        {/* Logo at top-left */}
        <div className="mb-8">
          <Logo size={120} />
        </div>
        
        {/* Form centered vertically */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            {/* Form Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
              <p className="text-gray-600">Welcome to Emjay - Let's Get Started</p>
            </div>

            {/* Login Form Component */}
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1887&auto=format&fit=crop"
            alt="Emjay Beauty"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}