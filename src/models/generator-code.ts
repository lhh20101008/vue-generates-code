import {Guid} from 'guid-typescript';

export default interface GeneratorDto {
    id: Guid
    name: string
    type: string
    description: string
    isShowList: boolean
    isShowForm: boolean
    isRequired: boolean
    formType: number,
    defaultValue: string
}
