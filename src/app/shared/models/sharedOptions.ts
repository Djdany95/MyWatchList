/**
 * Model to Shared Options Object
 */
export class SharedOptions {
  /**
   * Constructor
   * @param url Shared url
   * @param theme Shared theme
   * @param description Shared description
   */
  constructor(
    public url: string,
    public theme: string,
    public description: string
  ) {}
}
