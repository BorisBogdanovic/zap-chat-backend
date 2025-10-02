<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

public function messages(): array
{
    return [
        'name.required' => 'First name is required.',
        'name.string'   => 'First name must be a valid string.',
        'name.max'      => 'First name must not exceed 255 characters.',

        
        'last_name.required' => 'Last name is required.',
        'last_name.string'   => 'Last name must be a valid string.',
        'last_name.max'      => 'Last name must not exceed 255 characters.',

       
        'username.required' => 'Username is required.',
        'username.string'   => 'Username must be a valid string.',
        'username.max'      => 'Username must not exceed 255 characters.',
        'username.unique'   => 'This username is already taken.',

       
        'email.required' => 'Email is required.',
        'email.string'   => 'Email must be a valid string.',
        'email.email'    => 'Please enter a valid email address.',
        'email.max'      => 'Email must not exceed 255 characters.',
        'email.unique'   => 'This email is already registered.',

        
        'password.required'  => 'Password is required.',
        'password.string'    => 'Password must be a valid string.',
        'password.min'       => 'Password must be at least 8 characters long.',
        'password.confirmed' => 'Password confirmation does not match.',
    ];
}

}
