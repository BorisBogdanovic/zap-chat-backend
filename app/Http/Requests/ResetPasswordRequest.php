<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
      return [
        'email' => [
            'required',
            'email',
            'exists:users,email',
        ],
        'token' => [
            'required',
            'string',
        ],
        'password' => [
            'required',
            'string',
            'min:8',
            'confirmed',
            
        ],
    ];
    }

    public function messages(): array
{
    return [
        
        'email.required' => 'Email is required.',
        'email.email'    => 'Please enter a valid email address.',
        'email.exists'   => 'No account found with this email.',

       
        'token.required' => 'Reset token is required.',
        'token.string'   => 'Reset token must be a valid string.',

        'password.required'  => 'Password is required.',
        'password.string'    => 'Password must be a valid string.',
        'password.min'       => 'Password must be at least 8 characters long.',
        'password.confirmed' => 'Password confirmation does not match.',
    ];
}
}
