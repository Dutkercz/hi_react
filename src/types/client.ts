import type { AddressResponse } from "./addess"
import type { StayResponse } from "./room"

export type ClientRequest = {
    firstName: string
    lastName: string
    cpf: string
    cnpj?: string
    phoneNumber: string
    addresses: Address[]
}

export type ClientDetails = {
    id: number;
    idClient: string;
    firstName: string;
    lastName: string;
    cnpj: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
    addresses: AddressResponse[];
    stays: StayResponse[];
  }

export type Address = {
    zipCode: string
    street: string
    number: string
    state: string
    city: string
}

export type ClientResponse = {
    id: number
    firstName: string
    lastName: string
    createdAt: string
}

export type ClientUpdate = {
    id: number
    firstName: string
    lastName: string
    phoneNumber: string
}

export type ClientSummary = Pick<ClientResponse, "id" | "firstName" | "lastName">
