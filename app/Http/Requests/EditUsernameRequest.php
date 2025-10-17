<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditUsernameRequest extends FormRequest
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
            'username' => 'required|string|max:255|unique:users,username',
        ];
    }

    public function messages(): array
{
    return [
        'username.required' => 'Username is required.',
        'username.string'   => 'Username must be a valid string.',
        'username.max'      => 'Username must not exceed 255 characters.',
        'username.unique'   => 'This username is already taken.',
];
}
}
