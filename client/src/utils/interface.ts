import { ChangeEvent, FormEvent } from 'react'

export type FormChanged = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>

export type FormSubmitted = FormEvent<HTMLFormElement>