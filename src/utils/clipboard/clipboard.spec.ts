import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import copy from './clipboard';

describe('clipboard copy', () => {
  let execCommandMock: any;
  let createElementMock: any;
  let appendChildMock: any;
  let removeChildMock: any;

  beforeEach(() => {
    // Mock global objects since we run in a Node environment by default
    global.document = {
      createElement: vi.fn(),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: vi.fn(),
    } as any;

    global.window = {
      alert: vi.fn(),
    } as any;
    // alert is also called globally, so we mock global.alert
    global.alert = vi.fn();

    execCommandMock = document.execCommand = vi.fn().mockReturnValue(true);

    const mockTextArea = {
      value: '',
      select: vi.fn(),
    } as any;

    createElementMock = document.createElement = vi.fn().mockReturnValue(mockTextArea);
    appendChildMock = document.body.appendChild = vi.fn().mockImplementation(() => mockTextArea);
    removeChildMock = document.body.removeChild = vi.fn().mockImplementation(() => mockTextArea);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    delete global.document;
    // @ts-ignore
    delete global.window;
    // @ts-ignore
    delete global.alert;
  });

  it('should copy text successfully', () => {
    const textToCopy = 'test string';
    const result = copy(textToCopy);

    expect(result).toBe(true);
    expect(createElementMock).toHaveBeenCalledWith('textarea');
    expect(appendChildMock).toHaveBeenCalled();
    expect(execCommandMock).toHaveBeenCalledWith('copy');
    expect(removeChildMock).toHaveBeenCalled();
  });

  it('should alert on failure', () => {
    // Simulate execCommand throwing an error
    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('Copy failed');
    });

    const result = copy('test string');

    expect(result).toBeUndefined();
    expect(global.alert).toHaveBeenCalledWith('Copy failed');
  });
});
