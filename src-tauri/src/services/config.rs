use keyring::Entry;
use crate::error::{AppError, AppResult};

pub struct KeyringService;

impl KeyringService {
    const SERVICE_NAME: &'static str = "FastClip";

    pub fn set_api_key(provider: &str, key: &str) -> AppResult<()> {
        let entry = Entry::new(Self::SERVICE_NAME, provider)
            .map_err(|e| AppError::Internal(format!("Keyring error: {}", e)))?;
        
        entry.set_password(key)
            .map_err(|e| AppError::Internal(format!("Failed to set API key: {}", e)))?;
        
        Ok(())
    }

    pub fn get_api_key(provider: &str) -> AppResult<Option<String>> {
        let entry = Entry::new(Self::SERVICE_NAME, provider)
            .map_err(|e| AppError::Internal(format!("Keyring error: {}", e)))?;
        
        match entry.get_password() {
            Ok(key) => Ok(Some(key)),
            Err(keyring::Error::NoEntry) => Ok(None),
            Err(e) => Err(AppError::Internal(format!("Failed to get API key: {}", e))),
        }
    }

    pub fn delete_api_key(provider: &str) -> AppResult<()> {
        let entry = Entry::new(Self::SERVICE_NAME, provider)
            .map_err(|e| AppError::Internal(format!("Keyring error: {}", e)))?;
        
        match entry.delete_credential() {
            Ok(_) => Ok(()),
            Err(keyring::Error::NoEntry) => Ok(()),
            Err(e) => Err(AppError::Internal(format!("Failed to delete API key: {}", e))),
        }
    }
}
