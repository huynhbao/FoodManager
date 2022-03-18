export class Category {
    private id: number;
    private name: string;
    private createDate: Date;
    private status: boolean;
    constructor(id: number, name: string, createDate: Date, status: boolean) {
      this.id = id;
      this.name = name;
      this.createDate = createDate;
      this.status = status;
    }

    /**
     * Getter $id
     * @return {number}
     */
	public get $id(): number {
		return this.id;
	}

    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $createDate
     * @return {Date}
     */
	public get $createDate(): Date {
		return this.createDate;
	}

    /**
     * Getter $status
     * @return {boolean}
     */
	public get $status(): boolean {
		return this.status;
	}

    /**
     * Setter $id
     * @param {number} value
     */
	public set $id(value: number) {
		this.id = value;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $createDate
     * @param {Date} value
     */
	public set $createDate(value: Date) {
		this.createDate = value;
	}

    /**
     * Setter $status
     * @param {boolean} value
     */
	public set $status(value: boolean) {
		this.status = value;
	}


  }