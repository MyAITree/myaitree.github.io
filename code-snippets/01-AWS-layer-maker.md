Here are the step-by-step commands to create an **AWS Lambda Layer** containing Python dependencies (`requests` and `lxml`) for your XPath extractor function:

---

### **1. Prepare Dependencies Locally**
*(Skip this if using AWS CloudShell)*

```bash
# Create a temporary directory
mkdir -p python_dependencies/python/lib/python3.9/site-packages
cd python_dependencies

# Install dependencies to the target directory (use the same Python version as your Lambda)
pip install requests lxml -t python/lib/python3.9/site-packages/

# (For Python 3.8/3.10, replace "python3.9" with your version)
```

---

### **2. Compress the Layer**
```bash
# Zip the contents (not the parent folder)
zip -r9 ../xpath_dependencies.zip .
```

---

### **3. Create the Layer via AWS CLI**
```bash
aws lambda publish-layer-version \
  --layer-name xpath_dependencies \
  --description "Python dependencies for XPath extraction (requests+lxml)" \
  --zip-file fileb://xpath_dependencies.zip \
  --compatible-runtimes python3.8 python3.9 python3.10 \
  --compatible-architectures x86_64
```

**Successful output will include:**
```json
{
  "LayerVersionArn": "arn:aws:lambda:REGION:ACCOUNT_ID:layer:xpath_dependencies:1"
}
```

---

### **4. Attach Layer to Lambda Function**
#### **Option A: AWS CLI**
```bash
aws lambda update-function-configuration \
  --function-name YOUR_FUNCTION_NAME \
  --layers LAYER_ARN
```

#### **Option B: Console**
1. Go to your Lambda function → **Layers** → **Add a layer**
2. Select **Custom layers** → Choose `xpath_dependencies`

---

### **Alternative: CloudShell (Fully Online)**
If you don’t have a local environment:
1. Open [AWS CloudShell](https://console.aws.amazon.com/cloudshell/)
2. Run:
   ```bash
   mkdir -p python/lib/python3.9/site-packages
   pip install requests lxml -t python/lib/python3.9/site-packages/
   zip -r9 xpath_dependencies.zip python
   aws lambda publish-layer-version --layer-name xpath_dependencies --zip-file fileb://xpath_dependencies.zip --compatible-runtimes python3.9
   ```

---

### **Key Notes**
1. **Python Version**: Match the runtime version (e.g., `python3.9` for Lambda Python 3.9).
2. **Layer Limits**:
   - Max size: 250MB (unzipped)
   - Max 5 layers per function
3. **Cross-Region**: To use in another region, re-upload the ZIP there.

For **Puppeteer (Pyppeteer)** layers, see [this guide](https://github.com/shelfio/chrome-aws-lambda-layer).
