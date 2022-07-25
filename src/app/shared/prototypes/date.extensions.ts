interface Date {
    addHours(h:number): Date;
}

Date.prototype.addHours= function(h:number){
    this.setHours(this.getHours()+h);
    return this;
}