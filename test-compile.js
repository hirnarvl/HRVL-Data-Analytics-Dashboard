const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', {stdio: 'inherit'});
  console.log("Success");
} catch (e) {
  console.log("Failed");
}
