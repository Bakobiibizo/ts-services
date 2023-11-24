import { TheCount } from '../../services/theCount/counter';
import * as fs from 'fs';
import * as path from 'path';

describe('TheCount', () => {
    let theCount: TheCount;
    const mockDirectory = '/mock/directory';
    const mockFiles = ['file1.txt', 'file2.txt', 'file3.md'];

    beforeEach(() => {
        // Arrange
        theCount = new TheCount(0);
        jest.spyOn(fs, 'existsSync').mockImplementation((directory) => directory === mockDirectory);
        jest.spyOn(fs, 'readdirSync').mockImplementation(() => mockFiles);
        jest.spyOn(fs, 'statSync').mockImplementation((filePath) => ({
            isFile: () => mockFiles.includes(path.basename(filePath)),
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should count the number of files in a directory', () => {
        // Act
        const count = theCount.countFilesInDir(mockDirectory);

        // Assert
        expect(count).toBe(mockFiles.length);
    });

    test('should return 0 if the directory does not exist', () => {
        // Act
        const count = theCount.countFilesInDir('/non/existent/directory');

        // Assert
        expect(count).toBe(0);
    });

    test('should correctly count files when initialized with a non-zero count', () => {
        // Arrange
        const initialCount = 5;
        theCount = new TheCount(initialCount);

        // Act
        const count = theCount.countFilesInDir(mockDirectory);

        // Assert
        expect(count).toBe(initialCount + mockFiles.length);
    });

    test('should not count directories as files', () => {
        // Arrange
        jest.spyOn(fs, 'statSync').mockImplementation((filePath) => ({
            isFile: () => false,
        }));

        // Act
        const count = theCount.countFilesInDir(mockDirectory);

        // Assert
        expect(count).toBe(0);
    });

    test('should handle directories with a mix of files and subdirectories', () => {
        // Arrange
        const mixedContents = ['file1.txt', 'subdir', 'file2.txt'];
        jest.spyOn(fs, 'readdirSync').mockImplementation(() => mixedContents);
        jest.spyOn(fs, 'statSync').mockImplementation((filePath) => ({
            isFile: () => path.extname(filePath) === '.txt',
        }));

        // Act
        const count = theCount.countFilesInDir(mockDirectory);

        // Assert
        expect(count).toBe(2); // Only the .txt files should be counted
    });

    // Add more tests for edge cases and error cases as needed
});
