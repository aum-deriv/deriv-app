import { THooks } from '../../../../../../types';
import { validateCryptoAddress, validateCryptoInput, validateFiatInput } from '../withdrawalCryptoValidators';

describe('withdrawalCryptoValidator', () => {
    let mockValue = '2.5';
    let mockIsClientVerified = true;
    let mockCryptoAddress = 'jds93e9f8wefun9w8efrn98wefn09inf0';

    const mockActiveWallet = {
        balance: 10,
        currency: 'BTC',
        currency_config: {
            minimum_withdrawal: 1,
        },
    } as THooks.ActiveWalletAccount;

    const mockFractionalDigits = {
        crypto: 7,
        fiat: 2,
    };
    const mockRemainder = 9;

    it('should check if no errors are returned when valid inputs are provided for crypto address', () => {
        const cryptoAddressMessages = validateCryptoAddress(mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual(undefined);
    });

    it('should check if no errors are returned when valid inputs are provided for crypto amount', () => {
        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual(undefined);
    });

    it('should check if no errors are returned when valid inputs are provided for fiat amount', () => {
        const fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(fiatAmountMessages).toEqual(undefined);
    });

    it('should return error for invalid crypto address when length is lesser than 25 characters', () => {
        mockCryptoAddress = 'wrfie0493n0';
        const cryptoAddressMessages = validateCryptoAddress(mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual('Your wallet address should have 25 to 64 characters.');
    });

    it('should return error for invalid crypto address when length is greater than 64 characters', () => {
        mockCryptoAddress = 'moie0420349irn039fn09krf0n9r0f9n0r9fkn093nkf09k3n0f9n309fn09rkf09r0f9n93n0';
        const cryptoAddressMessages = validateCryptoAddress(mockCryptoAddress);

        expect(cryptoAddressMessages).toEqual('Your wallet address should have 25 to 64 characters.');
    });

    it('should return "Should be a valid number." error for invalid crypto amount', () => {
        mockValue = 'aad';
        let cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.';
        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');

        mockValue = '.';
        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.03abcd';
        cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Should be a valid number.');
    });

    it('should return "Should be a valid number." error for invalid fiat amount', () => {
        mockValue = 'aad';
        let fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.';
        fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '.';
        fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');

        mockValue = '5.03abcd';
        fiatAmountMessages = validateFiatInput(mockFractionalDigits, mockValue);

        expect(fiatAmountMessages).toEqual('Should be a valid number.');
    });

    it('should return "Insufficient funds" if amount > balance', () => {
        mockValue = '11.0000000';

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Insufficient funds');
    });

    it('should return error if amount > max withdrawal limit OR amount < min withdrawal limit for a verified user', () => {
        mockValue = '11.0000000';

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual('Insufficient funds');
    });

    it('should return error if amount > max withdrawal limit OR amount < min withdrawal limit for an unverified user', () => {
        mockValue = '11.0000000';
        mockIsClientVerified = false;

        const cryptoAmountMessages = validateCryptoInput(
            mockActiveWallet,
            mockFractionalDigits,
            mockIsClientVerified,
            mockRemainder,
            mockValue
        );

        expect(cryptoAmountMessages).toEqual(`The current allowed withdraw amount is 1.0000000 to 9.0000000 BTC.`);
    });

    it('should return "This field is required." if no value is passed to crypto address field', () => {
        const cryptoAddressMessages = validateCryptoAddress('');

        expect(cryptoAddressMessages).toEqual('This field is required.');
    });
});
