// Making "snapshot"  files are create besides the test file.

const resolveSnapshotPath = (
	testPath, // Path of the test file being test3ed
	snapshotExtension, // The extension for snapshots (.snap usually)
) => {
	const snapshotFilePath = testPath + snapshotExtension; // Ex. some.test.tsx + '.snap'
	return snapshotFilePath;
};

const resolveTestPath = (
	snapshotFilePath, // The filename of the snapshot (i.e. some.test.tsx.snap)
	snapshotExtension, // The extension for snapshots (.snap)
) => {
	const testPath = snapshotFilePath
		.replace(snapshotExtension, '')
		.replace('__snapshots__/', ''); //Remove the .snap
	return testPath;
};

/* Used to validate resolveTestPath(resolveSnapshotPath( {this} )) */
const testPathForConsistencyCheck = 'some.test.tsx';

module.exports = {
	resolveSnapshotPath,
	resolveTestPath,
	testPathForConsistencyCheck,
};
