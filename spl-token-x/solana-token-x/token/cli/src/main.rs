use spl_token_cli_x::MAX_PRIO_FEE_MICRO_LAMPORTS;
use {
    solana_sdk::signer::Signer,
    spl_token_cli_x::{clap_app::*, command::process_command, config::Config},
    std::{str::FromStr, sync::Arc},
};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let default_decimals = format!("{}", spl_token_2022::native_mint::DECIMALS);
    let minimum_signers_help = minimum_signers_help_string();
    let multisig_member_help = multisig_member_help_string();
    let app_matches = app(
        &default_decimals,
        &minimum_signers_help,
        &multisig_member_help,
    )
    .get_matches();
    unsafe {
        MAX_PRIO_FEE_MICRO_LAMPORTS = app_matches
            .value_of("MAX_PRIO_FEE_LAMPORTS")
            .map(|s| s.parse::<f64>().unwrap() * 1_000.0); // convert to microlamports
    }
    let mut wallet_manager = None;
    let mut bulk_signers: Vec<Arc<dyn Signer>> = Vec::new();

    let (sub_command, sub_matches) = app_matches.subcommand();
    let sub_command = CommandName::from_str(sub_command).unwrap();
    let matches = sub_matches.unwrap();

    let mut multisigner_ids = Vec::new();
    let config = Config::new(
        matches,
        &mut wallet_manager,
        &mut bulk_signers,
        &mut multisigner_ids,
    )
    .await;

    solana_logger::setup_with_default("solana=info");
    let result =
        process_command(&sub_command, matches, &config, wallet_manager, bulk_signers).await?;
    println!("{}", result);
    Ok(())
}
