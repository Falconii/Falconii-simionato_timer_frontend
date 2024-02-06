export class DynamicFlatNodeV2 {
  constructor(
    public item: string,
    public objeto: any = null,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}
