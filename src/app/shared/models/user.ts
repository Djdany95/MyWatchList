/**
 * Model to User Object
 */
export class User {
  /**
   * Constructor
   * @param name User name
   * @param pass User password
   * @param email User email
   * @param imageUrl User profileImage
   */
  constructor(
    public name: string,
    public pass: string,
    public email: string,
    public imageUrl: string
  ) {}
}
