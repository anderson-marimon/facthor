export enum EInvoiceStatus {
	VALIDATION_PENDING = 1,
	VALIDATION_FAILED = 2,
	ENABLEMENT_PENDING = 3,
	NOT_ENABLED = 4,
	ENABLED = 5,
	INCOMPLETE_DIAN_EVENTS = 6,
	DIAN_EVENTS_CREATED = 7,
	NEGOTIATION_LIST = 8,
	IN_NEGOTIATION = 9,
	RADIAN_NEGOTIATION_EVENTS_PENDING = 10,
	RADIAN_NEGOTIATION_EVENTS_COMPLETED = 11,
	SOLD = 12,
}
