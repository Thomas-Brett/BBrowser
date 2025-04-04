package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"io"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/crypto/pbkdf2"
)

const (
	EncryptedPrefix = "$e"
	SaltSize        = 16
	KeySize         = 32
	Iterations      = 100000
)

type CryptoManager struct {
	masterKey []byte
}

func NewCryptoManager(password string) (*CryptoManager, error) {
	// In a real app, you'd want to store this salt securely
	// and consistently for the same user
	salt := []byte("your-application-salt")

	// Derive encryption key from password using PBKDF2
	key := pbkdf2.Key([]byte(password), salt, Iterations, KeySize, sha256.New)

	return &CryptoManager{
		masterKey: key,
	}, nil
}

// EncryptFileName encrypts a file name and adds the prefix
func (cm *CryptoManager) EncryptFileName(fileName string) (string, error) {
	encrypted, err := cm.encrypt([]byte(fileName))
	if err != nil {
		return "", err
	}

	// Base64 encode for filesystem compatibility
	encodedName := base64.URLEncoding.EncodeToString(encrypted)

	// Add the prefix to mark as encrypted
	return EncryptedPrefix + encodedName, nil
}

// DecryptFileName decrypts a file name if it has the encrypted prefix
func (cm *CryptoManager) DecryptFileName(fileName string) (string, error) {
	// Check if the file is encrypted
	if !strings.HasPrefix(fileName, EncryptedPrefix) {
		return fileName, nil // Return as-is if not encrypted
	}

	// Remove the prefix
	encodedName := strings.TrimPrefix(fileName, EncryptedPrefix)

	// Decode from base64
	encryptedData, err := base64.URLEncoding.DecodeString(encodedName)
	if err != nil {
		return "", err
	}

	// Decrypt the name
	decryptedData, err := cm.decrypt(encryptedData)
	if err != nil {
		return "", err
	}

	return string(decryptedData), nil
}

// EncryptFile encrypts a file
func (cm *CryptoManager) EncryptFile(sourcePath, destPath string) error {
	// Read the original file
	plaintext, err := os.ReadFile(sourcePath)
	if err != nil {
		return err
	}

	// Encrypt the content
	encrypted, err := cm.encrypt(plaintext)
	if err != nil {
		return err
	}

	// Write to the destination file
	return os.WriteFile(destPath, encrypted, 0600)
}

// DecryptFile decrypts a file
func (cm *CryptoManager) DecryptFile(encryptedPath, destPath string) error {
	// Read the encrypted file
	ciphertext, err := os.ReadFile(encryptedPath)
	if err != nil {
		return err
	}

	// Decrypt the content
	plaintext, err := cm.decrypt(ciphertext)
	if err != nil {
		return err
	}

	// Write to the destination file
	return os.WriteFile(destPath, plaintext, 0600)
}

// DecryptToMemory decrypts a file into memory only (for viewing within the app)
func (cm *CryptoManager) DecryptToMemory(encryptedPath string) ([]byte, error) {
	// Read the encrypted file
	ciphertext, err := os.ReadFile(encryptedPath)
	if err != nil {
		return nil, err
	}

	// Decrypt the content
	return cm.decrypt(ciphertext)
}

// encrypt encrypts data using AES-GCM
func (cm *CryptoManager) encrypt(plaintext []byte) ([]byte, error) {
	block, err := aes.NewCipher(cm.masterKey)
	if err != nil {
		return nil, err
	}

	// Create a new GCM mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	// Create a nonce
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return nil, err
	}

	// Encrypt and authenticate data, then prepend the nonce
	return append(nonce, gcm.Seal(nil, nonce, plaintext, nil)...), nil
}

// decrypt decrypts data using AES-GCM
func (cm *CryptoManager) decrypt(data []byte) ([]byte, error) {
	block, err := aes.NewCipher(cm.masterKey)
	if err != nil {
		return nil, err
	}

	// Create a new GCM mode
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonceSize := gcm.NonceSize()
	if len(data) < nonceSize {
		return nil, errors.New("ciphertext too short")
	}

	// Extract nonce and ciphertext
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]

	// Decrypt and verify
	return gcm.Open(nil, nonce, ciphertext, nil)
}

// IsEncrypted checks if a file name indicates encryption
func IsEncrypted(fileName string) bool {
	return strings.HasPrefix(fileName, EncryptedPrefix)
}

// GetDecryptedFileName returns the decrypted file name (for display purposes)
func (cm *CryptoManager) GetDecryptedFileName(path string) (string, error) {
	fileName := filepath.Base(path)
	return cm.DecryptFileName(fileName)
}
