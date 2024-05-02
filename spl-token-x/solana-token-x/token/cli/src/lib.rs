mod bench;
pub mod clap_app;
pub mod command;
pub mod config;
mod encryption_keypair;
mod output;
mod sort;

pub static mut MAX_PRIO_FEE_MICRO_LAMPORTS: Option<f64> = None;
