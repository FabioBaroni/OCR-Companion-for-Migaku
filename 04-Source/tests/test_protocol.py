import base64,json,struct,subprocess,shutil,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'01-Mac-App/OCR Companion for Migaku.app/Contents/Helpers/ocrcompanion-native'
ORIGIN='chrome-extension://'+'a'*32+'/'
def frame(obj):
 b=json.dumps(obj).encode();return struct.pack('=I',len(b))+b
def decode(data):
 result=[]
 while data:
  assert len(data)>=4,'unframed stdout';size=struct.unpack('=I',data[:4])[0];assert size<1000000 and len(data)>=4+size
  result.append(json.loads(data[4:4+size]));data=data[4+size:]
 return result
class Protocol(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.temp=tempfile.TemporaryDirectory(dir=ROOT/'04-Source/tests');cls.folder=Path(cls.temp.name);cls.binary=cls.folder/'ocrcompanion-native';shutil.copy2(SOURCE,cls.binary);(cls.folder/'allowed-origins.json').write_text(json.dumps({'allowed_origins':[ORIGIN]}))
 @classmethod
 def tearDownClass(cls):cls.temp.cleanup()
 def call(self,data,origin=ORIGIN):
  p=subprocess.run([str(self.binary)]+([origin] if origin else []),input=data,capture_output=True,timeout=20);self.assertEqual(p.returncode,0,p.stderr.decode());return decode(p.stdout)
 def test_health(self):
  r=self.call(frame({'v':1,'action':'health'}))[0];self.assertTrue(r['ok']);self.assertEqual(r['protocol'],1);self.assertEqual(r['version'],'1.1.1');print('Live native health:',json.dumps(r))
 def test_unauthorized_origin(self):self.assertEqual(self.call(frame({'v':1,'action':'health'}),'chrome-extension://'+'b'*32+'/')[0]['code'],'unauthorized_origin')
 def test_missing_origin(self):self.assertEqual(self.call(b'',None)[0]['code'],'unauthorized_origin')
 def test_oversized_frame(self):self.assertEqual(self.call(struct.pack('=I',25*1024*1024))[0]['code'],'invalid_length')
 def test_truncated_header(self):self.assertEqual(self.call(b'xx')[0]['code'],'truncated_message')
 def test_truncated_body(self):self.assertEqual(self.call(struct.pack('=I',100)+b'{}')[0]['code'],'truncated_message')
 def test_malformed_json(self):self.assertEqual(self.call(struct.pack('=I',4)+b'xxxx')[0]['code'],'invalid_request')
 def test_wrong_protocol(self):self.assertEqual(self.call(frame({'v':2,'action':'health'}))[0]['code'],'protocol_version')
 def test_arbitrary_action_rejected(self):self.assertEqual(self.call(frame({'v':1,'action':'/bin/sh','path':'/etc/passwd'}))[0]['code'],'invalid_action')
 def test_language(self):self.assertEqual(self.call(frame({'v':1,'action':'ocr','language':'../en','image':'YWJj'}))[0]['code'],'invalid_language')
 def test_bad_base64(self):self.assertEqual(self.call(frame({'v':1,'action':'ocr','language':'zh-Hans','image':'%%%'}))[0]['code'],'invalid_image')
 def test_bad_image(self):self.assertEqual(self.call(frame({'v':1,'action':'ocr','language':'zh-Hans','image':'YWJj'}))[0]['code'],'invalid_image')
 def test_persistent_frames(self):
  r=self.call(frame({'v':1,'action':'health'})+frame({'v':1,'action':'unknown'})+frame({'v':1,'action':'health'}));self.assertEqual(len(r),3);self.assertTrue(r[0]['ok']);self.assertEqual(r[1]['code'],'invalid_action');self.assertTrue(r[2]['ok'])
if __name__=='__main__':unittest.main(verbosity=2)
