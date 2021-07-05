const LOCATION_BIGINT_PRECISION = 10000000;

export class NewsEventDTO {
	id: string;
	title: string;
	supporters: number;
	longitude: number;
	latitude: number;

	constructor(item: Record<string, any>) {
		this.id = item.id;
		this.title = item.title;
		this.supporters = item.supporters;
		this.longitude = item.longitude / LOCATION_BIGINT_PRECISION;
		this.latitude = item.latitude / LOCATION_BIGINT_PRECISION;
	}
}
