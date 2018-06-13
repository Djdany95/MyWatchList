/**
 * Model to Series Object
 */
export class Series {
  /**
   * Constructor
   * @param id Series iMDBID
   * @param active Series on air or not
   * @param name Series name
   * @param temp Series actual season
   * @param epA Series actual episode
   */
  constructor(
    public id: string,
    public active: boolean,
    public name: string,
    public temp: number,
    public epA: number
  ) {}
}
