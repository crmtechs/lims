<?php

namespace App\Http\Requests\Core;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class DisciplineUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $uuid = $this->route('uuid');
        $uuid = is_object($uuid) ? ($uuid->uuid ?? $uuid->getKey()) : $uuid;

        return [
            'discipline' => [
                'required',
                'string',
                'max:255',
                Rule::unique('disciplines', 'discipline')->ignore($uuid, 'uuid')->withoutTrashed(),
            ],
            'short_name' => [
                'required',
                'string',
                'max:3',
                Rule::unique('disciplines', 'short_name')->ignore($uuid, 'uuid')->withoutTrashed(),
            ],
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'discipline.required' => 'Discipline is required.',
            'discipline.max' => 'Discipline cannot exceed 255 characters.',
            'discipline.unique' => 'Discipline already exists.',
            'short_name.required' => 'Short name is required.',
            'short_name.max' => 'Short name cannot exceed 3 characters.',
            'short_name.unique' => 'Short name already exists.',
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
