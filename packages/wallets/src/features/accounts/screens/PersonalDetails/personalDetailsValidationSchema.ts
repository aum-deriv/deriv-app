import * as Yup from 'yup';
import { THooks } from '../../../../types';

type TGetTinValidatorSchema = {
    residenceList: THooks.ResidenceList;
    taxResidence: string;
};

const countryCodeToPatternMapper = (residenceList: THooks.ResidenceList) => {
    const countryCodeToPatternMapping: Record<string, string> = {};

    residenceList.forEach(residence => {
        if (residence.value && !(residence.value in countryCodeToPatternMapping)) {
            countryCodeToPatternMapping[residence.value] = residence?.tin_format?.[0] ?? '';
        }
    });
    return countryCodeToPatternMapping;
};

export const getTinValidatorSchema = ({ residenceList, taxResidence }: TGetTinValidatorSchema) => {
    const patternStr = countryCodeToPatternMapper(residenceList)[taxResidence];

    return Yup.object().shape({
        taxIdentificationNumber: Yup.string()
            .required('Please fill in Tax identification number')
            .matches(new RegExp(patternStr), 'The format is incorrect.'),
    });
};
