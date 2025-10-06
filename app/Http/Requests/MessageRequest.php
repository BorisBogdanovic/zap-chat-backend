<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessageRequest extends FormRequest
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
            'to_id'   => ['required', 'integer', 'exists:users,id', 'different:auth_id'],
            'message' => ['required', 'string', 'min:1', 'max:2000'],
        ];


    }
    protected function prepareForValidation(): void
{
    $this->merge(['auth_id' => auth()->id()]);
}
}
