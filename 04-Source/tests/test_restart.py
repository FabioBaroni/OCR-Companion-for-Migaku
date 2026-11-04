"""Safety smoke tests only: never invoke a valid restart or quit a real app."""
from pathlib import Path
import subprocess,unittest
SOURCE=Path(__file__).resolve().parents[1]
BINARY=SOURCE.parent/'01-Mac-App/OCR Companion for Migaku.app/Contents/Helpers/ocrcompanion-restart'
if not BINARY.exists(): BINARY=SOURCE/'macOS/Build/Beta9/OCR Companion for Migaku.app/Contents/Helpers/ocrcompanion-restart'
class RestartArguments(unittest.TestCase):
 def test_invalid_arguments_never_launch(self):
  for args in [[],['invalid'],['0'],['1'],['-5'],['999','extra']]:
   with self.subTest(args=args):
    self.assertEqual(subprocess.run([str(BINARY),*args],timeout=3,capture_output=True).returncode,2)
if __name__=='__main__':unittest.main(verbosity=2)
