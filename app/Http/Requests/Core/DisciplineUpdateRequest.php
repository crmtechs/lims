<?php

namespace App\Http\Requests\Core;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class DisciplineUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'discipline' => 'required|string|max:255',
            'short_name' => 'required|string|max:3',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'discipline.required' => 'Discipline name is required.',
            'discipline.max' => 'Discipline name cannot exceed 255 characters.',
            'short_name.required' => 'Short name is required.',
            'short_name.max' => 'Short name cannot exceed 3 characters.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        if ($this->expectsJson() || $this->ajax())
        {
            $errors = [];

            foreach ($validator->errors()->messages() as $field => $message)
            {
                $errors[$field] = $message[0];
            }

            throw new HttpResponseException(response()->json([
                'errors' => $errors,
            ], 422));
        }

        parent::failedValidation($validator);
    }
}
