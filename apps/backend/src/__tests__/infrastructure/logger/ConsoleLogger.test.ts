import { ConsoleLogger } from '../../../infrastructure/logger/ConsoleLogger';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new ConsoleLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('info()', () => {
    test('calls console.log with [INFO] prefix and the message', () => {
      logger.info('server started');

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[INFO] server started'));
    });

    test('includes an ISO timestamp in the output', () => {
      logger.info('any message');

      const output: string = logSpy.mock.calls[0][0];
      expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe('warn()', () => {
    test('calls console.warn with [WARN] prefix and the message', () => {
      logger.warn('low memory');

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[WARN] low memory'));
    });

    test('includes an ISO timestamp in the output', () => {
      logger.warn('any message');

      const output: string = warnSpy.mock.calls[0][0];
      expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe('error()', () => {
    test('calls console.error with [ERROR] prefix and the message', () => {
      logger.error('connection failed');

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR] connection failed'));
    });

    test('includes an ISO timestamp in the output', () => {
      logger.error('any message');

      const output: string = errorSpy.mock.calls[0][0];
      expect(output).toMatch(/^\[\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe('log()', () => {
    test('calls console.log with the message as-is', () => {
      logger.log('plain output');

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('plain output');
    });

    test('does not add any prefix or timestamp', () => {
      logger.log('clean message');

      const output: string = logSpy.mock.calls[0][0];
      expect(output).toBe('clean message');
    });
  });
});
